import { useComputed, useSignal } from "@vaadin/hilla-react-signals";
import { Checkbox, VerticalLayout } from "@vaadin/react-components";
import { VoteService } from "Frontend/generated/endpoints";

const options = {
    "Vaadin": VoteService.get("vaadin"),
    "React": VoteService.get("react"),
    "Angular": VoteService.get("anguoar")
}
export default function DemoView() {

    const maxVotes = useComputed(() => {
        const votes = Object.values(options).map(s => s.value);
        return Math.max(...votes, 1);
    });

    return (
        <VerticalLayout className="poll">
            <h1>How do you build UIs?</h1>

            {
                Object.entries(options).map(([label, signal]) => {
                    return <VerticalLayout key={label} className={label}>
                        <Checkbox label={label} onCheckedChanged={(event) => {
                            if (event.detail.value) {
                                signal.incrementBy(1);
                            } else {
                                signal.incrementBy(-1);
                            }
                        }} />
                        <div style={{ minWidth: (100 * signal.value / maxVotes.value) + "%" }}>{signal}</div>
                    </VerticalLayout>
                })
            }

        </VerticalLayout>
    );
}
