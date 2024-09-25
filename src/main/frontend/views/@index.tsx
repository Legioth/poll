import { ActionOnLostSubscription } from '@vaadin/hilla-frontend';
import { computed, NumberSignal, useSignal, useSignalEffect } from '@vaadin/hilla-react-signals';
import { Checkbox, RadioButton, RadioGroup, VerticalLayout } from '@vaadin/react-components';
import { StatsService } from 'Frontend/generated/endpoints';
import { useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Fragment } from 'react/jsx-runtime';

function firstWord(line: string): string {
  return line.replace(/[ -].*/, "");
}

const currentQuestion = StatsService.currentQuestion({ defaultValue: undefined });

const options = computed(() => {
  if (!currentQuestion?.value) {
    return {};
  }

  return Object.fromEntries(currentQuestion.value.options.map(({ caption, signalName }) => [caption, StatsService.getStats(signalName)]));
});

const maxVotes = computed(() => {
  const values = Object.values(options.value).map(signal => signal.value);
  return Math.max(...values, 1);
});

function handleChange(signal: NumberSignal, event: CustomEvent<{ value: boolean }>) {
  signal.incrementBy(event.detail.value ? 1 : -1);
}

export default function EmptyView() {
  const userCount = useSignal(1);
  useEffect(() => {
    const s = StatsService.userCount()
      .onSubscriptionLost(() => ActionOnLostSubscription.RESUBSCRIBE)
      .onNext(count => userCount.value = count);
    return () => s.cancel();
  }, []);

  useSignalEffect(() => {
    if (currentQuestion.value?.question) {
      document.body.classList.add("noscroll");
    } else {
      document.body.classList.remove("noscroll");
    }

    return () => document.body.classList.remove("noscroll");
  })

  if (!currentQuestion.value) {
    return "No poll has been started"
  }

  return <VerticalLayout className="poll">
    <h1>{currentQuestion.value?.question ?? "Waiting for participants"}</h1>

    <p className="join-at" >Join at <a href={location.href}>{location.href}</a></p>
    <p className="active-users">{userCount} active users</p>

    {!currentQuestion.value.question
      ? <QRCode value={location.href} className="qr" />

      : currentQuestion.value.multiple
        ? Object.entries(options.value).map(([label, signal]) => {
          return <VerticalLayout key={signal.id} className={firstWord(label)}>
            <Checkbox label={label} onCheckedChanged={(event) => handleChange(signal, event)} />
            <VotesBar votes={signal.value} maxVotes={maxVotes.value} />
          </VerticalLayout>;
        })
        : <RadioGroup>{
          Object.entries(options.value).map(([label, signal]) => {
            return <Fragment key={signal.id}>
              <RadioButton label={label} onCheckedChanged={(event) => handleChange(signal, event)} />
              <VotesBar votes={signal.value} maxVotes={maxVotes.value} />
            </Fragment>;
          })}
          <RadioButton label="Blank" />
        </RadioGroup>
    }
  </VerticalLayout>
}

function VotesBar({ votes, maxVotes }: { votes: number, maxVotes: number }) {
  return <div style={{ minWidth: (100 * votes / maxVotes) + "%" }}>{votes}</div>;
}
