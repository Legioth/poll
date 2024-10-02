package org.vaadin.leif;

import org.springframework.stereotype.Service;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.EndpointSubscription;
import com.vaadin.hilla.Nullable;
import com.vaadin.hilla.signals.NumberSignal;
import com.vaadin.hilla.signals.ValueSignal;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.Many;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@BrowserCallable
@Service
@AnonymousAllowed
public class StatsService {
    public record PollOption(String caption, String signalName) {
    }

    public record PollQuestion(@Nullable String question, boolean multiple, PollOption... options) {
    }

    private final ValueSignal<@Nullable PollQuestion> currentQuestion = new ValueSignal<>(
            PollQuestion.class);

    private final ConcurrentHashMap<String, NumberSignal> stats = new ConcurrentHashMap<>();

    private final Many<Integer> userCountSink = Sinks.many().replay().limit(1);
    private final Many<Integer> maxCountSink = Sinks.many().replay().limit(1);

    private volatile int maxCount = 0;

    public EndpointSubscription<Integer> userCount() {
        return EndpointSubscription.of(userCountSink.asFlux().doOnSubscribe(ignore -> {
            // + 1 since this subscription is not yet registered
            int count = userCountSink.currentSubscriberCount() + 1;
            userCountSink.tryEmitNext(count);

            if (count > maxCount) {
                // Fine to occasionally overwrite a larger number due to a race
                maxCount = count;
                maxCountSink.tryEmitNext(count);
            }
        }), () -> {
            userCountSink.tryEmitNext(userCountSink.currentSubscriberCount());
        });
    }

    public Flux<Integer> maxCount() {
        return maxCountSink.asFlux();
    }

    public NumberSignal getStats(String name) {
        return stats.computeIfAbsent(name, (ignore) -> new NumberSignal());
    }

    public ValueSignal<@Nullable PollQuestion> currentQuestion() {
        return currentQuestion;
    }

    public void resetStats() {
        stats.clear();
    }
}
