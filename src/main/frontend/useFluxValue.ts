import { ActionOnLostSubscription, Subscription } from "@vaadin/hilla-frontend";
import { Signal, useSignal } from "@vaadin/hilla-react-signals";
import { useEffect } from "react";

export default function useFluxValue<T>(endpoint: () => Subscription<T>, initialValue: T): Signal<T> {
    const signal = useSignal<T>(initialValue);

    useEffect(() => {
        const subscription = endpoint()
          .onSubscriptionLost(() => ActionOnLostSubscription.RESUBSCRIBE)
          .onNext(count => signal.value = count);
        return () => subscription.cancel();
      }, []);

    return signal;
}