import { Signal, useComputed, useSignal } from "@vaadin/hilla-react-signals";
import { Checkbox, VerticalLayout } from "@vaadin/react-components";
import { VoteService2 } from "Frontend/generated/endpoints";
import { useEffect } from "react";

// Example based on manual state management

export default function DemoView() {
    const options: Record<string, Signal<number>> = {
        "Vaadin": useSignal(5),
        "React": useSignal(2),
        "Angular": useSignal(1),
    }

    useEffect(() => {
        VoteService2.subscribe().onNext(update => {
            Object.entries(update).forEach(([label, value]) => {
                options[label].value = value;
            });
        });
    }, []);

    const maxVotes = useComputed(() => {
        const values = Object.values(options).map(s => s.value);
        return Math.max(...values, 1);
    });

    return (
        <VerticalLayout className="poll">
            <h1>How do you build UIs?</h1>

            {
                Object.entries(options).map(([label, signal]) => {
                    return <VerticalLayout key={label} className={label}>
                        <Checkbox label={label} onCheckedChanged={event => {
                            if (event.detail.value) {
                                signal.value++;
                                VoteService2.vote(label, 1 );
                            } else {
                                signal.value--;
                                VoteService2.vote(label, -1 );
                            }
                        }} />
                        <div style={{ minWidth: 100 * signal.value / maxVotes.value + "%" }}>{signal.value}</div>
                    </VerticalLayout>
                })
            }


        </VerticalLayout>
    );
}
