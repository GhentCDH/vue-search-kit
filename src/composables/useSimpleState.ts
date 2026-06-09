import {ref, toValue, watch, type Ref, type WatchHandle} from 'vue';

export interface SimpleState<T> {
    state: Ref<T>;
    setState: (newValue: T) => void;
    onChange: (callback: (newValue: T) => void) => WatchHandle;
}

export function useSimpleState<T>(initialValue: T): SimpleState<T> {
    const state = ref(toValue(initialValue)) as Ref<T>;

    const setState = (newValue: T) => {
        state.value = newValue;
    };

    const onChange = (callback: (newValue: T) => void) => {
        return watch(state, () => callback(toValue(state)));
    };

    return {
        state,
        setState,
        onChange,
    };
}
