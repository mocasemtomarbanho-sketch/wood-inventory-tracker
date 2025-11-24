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
      throw new Error('Webhook secret not configured');
    }

    // Verificar assinatura do webhook (se o Punshipay usar)
    const signature = req.headers.get('x-punshipay-signature');
    // Aqui você implementaria a validação da assinatura conforme documentação do Punshipay
    
    const payload = await req.json();
    console.log('Webhook received:', payload);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Processar evento do webhook
    const { event, data } = payload;

    if (event === 'payment.approved' || event === 'payment.confirmed') {
      const transactionId = data.id;
      const metadata = data.metadata;

      if (!metadata?.user_id) {
        console.error('No user_id in metadata');
        return new Response(JSON.stringify({ error: 'Invalid metadata' }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Calcular data de expiração (30 dias a partir de agora)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Atualizar assinatura para ativa (remove trial)
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          punshipay_transaction_id: transactionId,
          trial_ends_at: null // Limpa o trial quando ativa a assinatura
        })
        .eq('user_id', metadata.user_id);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }

      console.log(`Subscription activated for user ${metadata.user_id}, trial removed`);
    } else if (event === 'payment.failed' || event === 'payment.cancelled') {
      const metadata = data.metadata;
      
      if (metadata?.user_id) {
        // Marcar assinatura como inativa (não mexe no trial)
        await supabase
          .from('subscriptions')
          .update({ 
            status: 'inactive',
            punshipay_transaction_id: null
          })
          .eq('user_id', metadata.user_id);

        console.log(`Payment failed/cancelled for user ${metadata.user_id}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
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
