import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Message type that's used for this PubSub sample
  Message: a.customType({
    content: a.string().required(),
    channelName: a.string().required(),
  }),

  // Message publish mutation
  publish: a
    .mutation()
    .arguments({
      channelName: a.string().required(),
      content: a.string().required(),
    })
    .returns(a.ref("Message"))
    .handler(a.handler.custom({ entry: "./publish.js" }))
    .authorization((allow) => [allow.publicApiKey()]),

  // Subscribe to incoming messages
  receive: a
    .subscription()
    // subscribes to the 'publish' mutation
    .for(a.ref("publish"))
    // subscription handler to set custom filters
    .handler(a.handler.custom({ entry: "./receive.js" }))
    // authorization rules as to who can subscribe to the data
    .authorization((allow) => [allow.publicApiKey()]),

  // A data model to manage channels
  Channel: a
    .model({
      name: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
