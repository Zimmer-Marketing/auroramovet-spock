import { writable, type Updater } from "svelte/store";

export function createTopicStore(topic: string, onChange?: any) {
  const currentTopic = writable(topic);

  function update (updater: Updater<string>) {
    currentTopic.update((current) => {
      const newTopic = updater(current);
      onChange?.(newTopic);
      return newTopic;
    })
  }

  function changeTopic(newTopic: string) {
    update(newTopic);
  }

  function reset() {
    currentTopic.set('');
  }

  return {
    ...currentTopic,
    changeTopic,
    reset,
    update
  }

}