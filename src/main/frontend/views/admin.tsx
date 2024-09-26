import { Button, VerticalLayout } from "@vaadin/react-components";
import useFluxValue from 'Frontend/useFluxValue';
import { StatsService } from "Frontend/generated/endpoints";
import PollQuestion from "Frontend/generated/org/vaadin/leif/StatsService/PollQuestion";
import { useSearchParams } from "react-router-dom";

const currentQuestion = StatsService.currentQuestion({ defaultValue: undefined });

const options: PollQuestion[] = [
    {
        question: "How do you build UIs?", multiple: true, options: [
            { caption: "Vaadin", signalName: "vaadin" },
            { caption: "React", signalName: "react" },
            { caption: "Angular", signalName: "angular" },
            { caption: "Vue", signalName: "vue" },
            { caption: "Other client-side rendering", signalName: "spa" },
            { caption: "Server-side HTML", signalName: "html" },
            { caption: "Desktop / native mobile", signalName: "native" },
            { caption: "None / other", signalName: "none" },
        ]
    },
    {
        question: "Have you built collaborative UIs?", multiple: false, options: [
            { caption: "Yes, all the time", signalName: "building" },
            { caption: "Only a few times", signalName: "occasionally" },
            { caption: "Not yet but planning to", signalName: "planning" },
            { caption: "No and not planning to", signalName: "notBuilding" },
        ]
    },
    {
        question: "Why don't you build more collaborative UIs?", multiple: false, options: [
            { caption: "It's already all I do", signalName: "allIDo" },
            { caption: "Use cases are inherently single-user", signalName: "singleUser" },
            { caption: "Lack of customer awareness", signalName: "awareness" },
            { caption: "Not worth the additional UI design effort", signalName: "uiDesign" },
            { caption: "Not worth the additional implementation effort", signalName: "technicalDifficulty" },
        ]
    },
]

export default function Admin() {
    const [searchParams] = useSearchParams();

    const userCount = useFluxValue(StatsService.userCount, 0);
    const maxUsers = useFluxValue(StatsService.maxCount, 0);

    // Just a little bit of security by obscurity to avoid trivial "mistakes"
    if (!searchParams.has("pw")) {
        return;
    }

    return <VerticalLayout theme="padding spacing">
        Current users: {userCount}. Max users: {maxUsers}

        <Button onClick={() => {
            StatsService.resetStats();
            currentQuestion.value = { question: undefined, multiple: true, options: [] };
        }}>Clear</Button>

        {options.map((question) => {
            return <Button
                key={question.question}
                onClick={() => currentQuestion.value = question}
                theme={currentQuestion.value?.question == question.question ? "primary" : ""}
            >{question.question}</Button>;
        })}
    </VerticalLayout>;
}