import { useTracker, declareIndexPlugin, ReactRNPlugin } from "@remnote/plugin-sdk";

export const ACTIVE_RECALL = "active-recall_power-up";

let ARCSS: string;
let ARTAGGED: string;

async function onActivate(plugin: ReactRNPlugin) {
  await fetch("https://raw.githubusercontent.com/browneyedsoul/RemNote-ActiveRecall/main/src/snippet.css")
    .then((response) => response.text())
    .then((text) => {
      ARCSS = text;
      console.dir("Active Recall Installed");
    })
    .catch((error) => console.error(error));
  await fetch("https://raw.githubusercontent.com/browneyedsoul/RemNote-ActiveRecall/main/src/untag.css")
    .then((response) => response.text())
    .then((text) => {
      ARTAGGED = text;
      console.dir("Active Recall UnTagged Installed");
    })
    .catch((error) => console.error(error));
  await plugin.app.registerPowerup("Active Recall", ACTIVE_RECALL, "A Power-up for covering cloze", { slots: [] });
  await plugin.app.registerCommand({
    id: "active-recall",
    name: "Active Recall",
    action: async () => {
      const rem = await plugin.focus.getFocusedRem();
      await rem?.addPowerup(ACTIVE_RECALL);
    },
  });
  await plugin.settings.registerBooleanSetting({
    id: "scope",
    title: "Scope Expander",
    defaultValue: false,
  });
  plugin.track(async (reactivePlugin) => {
    const arSetting = await reactivePlugin.settings.getSetting<boolean>("scope");
    arSetting
      ? await plugin.app.registerCSS("active-recall-untagged", ARTAGGED)
      : await plugin.app.registerCSS("active-recall", ARCSS);
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
