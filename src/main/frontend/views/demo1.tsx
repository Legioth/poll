import { Signal, useComputed, useSignal } from "@vaadin/hilla-react-signals";
import { Checkbox, VerticalLayout } from "@vaadin/react-components";
import { VoteService1, VoteService2 } from "Frontend/generated/endpoints";
import { useEffect } from "react";

// Example based on sharing signals

const options = {
    "Vaadin": VoteService1.get("Vaadin"),
    "React": VoteService1.get("React"),
    "Angular": VoteService1.get("Angular"),
}

export default function DemoView() {

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
                                signal.incrementBy(1)
                            } else {
                                signal.incrementBy(-1);
                            }
                        }} />
                        <div style={{ minWidth: 100 * signal.value / maxVotes.value + "%" }}>{signal.value}</div>
                    </VerticalLayout>
                })
            }


        </VerticalLayout>
    );
}
