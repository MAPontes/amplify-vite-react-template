import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import "@aws-amplify/ui-react/styles.css";

const client = generateClient<Schema>();

function App() {
  const sub = client.subscriptions.receive().subscribe({
    next: (data) => {
      console.log(data);
    },
    error: (err) => {
      console.error(err);
    },
    complete: () => {
      console.log("complete");
    },
  });

  function unsub() {
    sub.unsubscribe();
  }

  function addChannel() {
    client.models.Channel.create({
      name: "world",
    });
  }

  function addItem() {
    client.mutations.publish({
      channelName: "world",
      content: "My first message!",
    });
  }

  return (
    <main>
      <h1>My Custom Subs</h1>
      <button onClick={unsub}>Unsubscribe</button>
      <h1></h1>
      <button onClick={addChannel}>Add Channel</button>
      <h1></h1>
      <button onClick={addItem}>Add Item</button>
    </main>
  );
}

export default App;
