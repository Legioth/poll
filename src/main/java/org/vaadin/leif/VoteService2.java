package org.vaadin.leif;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.Many;

@BrowserCallable
@AnonymousAllowed
public class VoteService2 {
    private final Map<String, Integer> options = new ConcurrentHashMap<>(Map.of(
            "Vaadin", 5,
            "React", 2,
            "Angular", 1));
    private Many<Map<String, Integer>> sink;

    public VoteService2() {
        sink = Sinks.many().replay().limit(1);
        sink.tryEmitNext(Map.copyOf(options));
    }

    public Flux<Map<String, Integer>> subscribe() {
        return sink.asFlux();
    }

    public void vote(String name, int delta) {
        options.computeIfPresent(name, (ignore, v) -> v + delta);
        sink.tryEmitNext(Map.copyOf(options));
    }
}
