import { FlagdProvider } from "@openfeature/flagd-provider";
import { OpenFeature } from "@openfeature/server-sdk";
import { ServerEventHook } from "@/libs/open-feature/server-event-hook";

console.log("registering the OpenFeature provider");

OpenFeature.addHooks(new ServerEventHook("feature_flag"));
OpenFeature.setProvider(new FlagdProvider({ resolverType: "in-process" }));
