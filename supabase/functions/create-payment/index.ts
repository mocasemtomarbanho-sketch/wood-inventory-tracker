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

    const punshipayToken = Deno.env.get('PUNSHIPAY_TOKEN');
    if (!punshipayToken) {
      throw new Error('Punshipay token not configured');
    }

    // Valor do plano mensal
    const amount = 100.00;

    // Criar ou atualizar assinatura com status pending
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_id: planId,
        amount: amount,
        status: 'pending'
      }, {
        onConflict: 'user_id'
      });

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      throw subscriptionError;
    }

    // Criar pagamento no Punshipay
    const paymentData = {
      amount: amount,
      description: `Assinatura Mensal - PalletePro`,
      customer_email: userId, // Você pode buscar o email do usuário se necessário
      return_url: `${req.headers.get('origin') || 'http://localhost:8080'}/planos`,
      webhook_url: `${supabaseUrl}/functions/v1/punshipay-webhook`,
      metadata: {
        user_id: userId,
        plan_id: planId
      }
    };

    console.log('Creating payment with Punshipay:', paymentData);

    const punshipayResponse = await fetch('https://api.punshipay.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${punshipayToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!punshipayResponse.ok) {
      const errorText = await punshipayResponse.text();
      console.error('Punshipay API error:', errorText);
      throw new Error(`Punshipay API error: ${errorText}`);
    }

    const paymentResult = await punshipayResponse.json();
    console.log('Payment created:', paymentResult);

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
        paymentUrl: paymentResult.payment_url || paymentResult.checkout_url,
        transactionId: paymentResult.id
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
