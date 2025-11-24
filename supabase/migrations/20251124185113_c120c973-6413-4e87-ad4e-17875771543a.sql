-- Adicionar campo trial_ends_at para período de teste de 7 dias
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone;

-- Criar função para inicializar trial de 7 dias após cadastro
CREATE OR REPLACE FUNCTION public.initialize_user_trial()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, status, trial_ends_at)
  VALUES (
    NEW.id,
    'trial',
    NOW() + INTERVAL '7 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar trigger para inicializar trial automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_trial();

-- Atualizar função has_active_subscription para incluir trial
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = _user_id
      AND (
        -- Assinatura ativa paga
        (status = 'active' AND expires_at > now())
        OR
        -- Trial ativo (7 dias grátis)
        (status = 'trial' AND trial_ends_at > now())
      )
  )
$function$;