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
    const { planId, userId } = await req.json();

    if (!userId || !planId) {
      throw new Error('Missing required parameters');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const pushinpayToken = Deno.env.get('PUNSHIPAY_TOKEN');
    if (!pushinpayToken) {
      throw new Error('Pushinpay token not configured');
    }

    // Valor de teste (R$ 1,00 em centavos)
    const amount = 100;

    // Criar ou atualizar assinatura com status pending
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_id: planId,
        amount: amount / 100,
        status: 'pending'
      }, {
        onConflict: 'user_id'
      });

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      throw subscriptionError;
    }

    // Criar pagamento PIX no Pushinpay
    const paymentData = {
      value: amount, // Valor em centavos
      webhook_url: `${supabaseUrl}/functions/v1/punshipay-webhook`
    };

    console.log('Creating PIX payment with Pushinpay:', paymentData);

    // URL correta da API Pushinpay para criar PIX
    const pushinpayResponse = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pushinpayToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!pushinpayResponse.ok) {
      const errorText = await pushinpayResponse.text();
      console.error('Pushinpay API error:', pushinpayResponse.status, errorText);
      throw new Error(`Pushinpay API error: ${errorText}`);
    }

    const paymentResult = await pushinpayResponse.json();
    console.log('PIX payment created:', paymentResult);

    // Atualizar assinatura com transaction_id
    if (paymentResult.id) {
      await supabase
        .from('subscriptions')
        .update({ punshipay_transaction_id: paymentResult.id })
        .eq('user_id', userId);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        pixCode: paymentResult.qr_code,
        pixCodeBase64: paymentResult.qr_code_base64,
        transactionId: paymentResult.id,
        status: paymentResult.status
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-payment function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});