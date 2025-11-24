import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get('PUNSHIPAY_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      throw new Error('Webhook secret not configured');
    }

    // Pushinpay envia dados em formato URL-encoded
    const contentType = req.headers.get('content-type') || '';
    let payload: any;

    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      // Parse URL-encoded data
      const text = await req.text();
      console.log('Webhook received (raw):', text);
      
      payload = {};
      const params = new URLSearchParams(text);
      for (const [key, value] of params.entries()) {
        payload[key] = value;
      }
    }

    console.log('Webhook payload parsed:', JSON.stringify(payload, null, 2));

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // O webhook do Pushinpay retorna o status da transação
    const transactionId = payload.id;
    const status = payload.status; // 'created', 'paid', 'expired', 'canceled'

    if (!transactionId) {
      console.error('No transaction ID in webhook payload');
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Buscar assinatura pelo transaction_id
    const { data: subscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('punshipay_transaction_id', transactionId)
      .single();

    if (fetchError || !subscriptions) {
      console.error('Subscription not found for transaction:', transactionId);
      return new Response(JSON.stringify({ error: 'Subscription not found' }), { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Processar evento do webhook baseado no status
    if (status === 'paid') {
      // Pagamento confirmado - ativar assinatura
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          trial_ends_at: null // Remove o trial quando ativa a assinatura
        })
        .eq('punshipay_transaction_id', transactionId);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }

      console.log(`✅ Subscription activated for user ${subscriptions.user_id}, trial removed`);
      
    } else if (status === 'expired' || status === 'canceled') {
      // Pagamento expirou ou foi cancelado
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'inactive',
          punshipay_transaction_id: null
        })
        .eq('punshipay_transaction_id', transactionId);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
      }

      console.log(`❌ Payment ${status} for user ${subscriptions.user_id}`);
    } else {
      console.log(`ℹ️ Payment status: ${status} for transaction ${transactionId}`);
    }

    return new Response(
      JSON.stringify({ success: true, status }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});