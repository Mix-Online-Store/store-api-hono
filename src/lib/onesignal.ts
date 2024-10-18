import * as OneSignal from "@onesignal/node-onesignal";

import env from "@/env";

const configuration = OneSignal.createConfiguration({
  restApiKey: env.ONE_SIGNAL_REST_API_KEY,
});

export const client = new OneSignal.DefaultApi(configuration);
