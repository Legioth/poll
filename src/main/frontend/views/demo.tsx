import { Checkbox, VerticalLayout } from "@vaadin/react-components";

export default function DemoView() {
    return (
        <VerticalLayout className="poll">
            <h1>How do you build UIs?</h1>
            
            <VerticalLayout className="Vaadin">
                <Checkbox label="Vaadin" />
                <div style={{ minWidth: "100%" }}>5</div>
            </VerticalLayout>
            <VerticalLayout className="React">
                <Checkbox label="React" />
                <div style={{ minWidth: "40%" }}>2</div>
            </VerticalLayout>
            <VerticalLayout className="Angular">
                <Checkbox label="Angular" />
                <div style={{ minWidth: "20%" }}>1</div>
            </VerticalLayout>
        </VerticalLayout>
    );
}
