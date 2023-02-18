import { declareIndexPlugin, ReactRNPlugin } from "@remnote/plugin-sdk";

export const ACTIVE_RECALL = "active-recall_power-up";

let ARCSS: string;
let ARTAGGED: string;

async function onActivate(plugin: ReactRNPlugin) {
  try {
    await fetch("snippet.css")
      .then((response) => response.text())
      .then((text) => {
        ARCSS = text;
        console.dir("Active Recall Installed from local");
      })
      .catch((error) => console.error(error));
  } catch (localError) {
    await fetch("https://raw.githubusercontent.com/browneyedsoul/RemNote-ActiveRecall/main/src/snippet.css")
      .then((response) => response.text())
      .then((text) => {
        ARCSS = text;
        console.dir("Active Recall Installed from CDN");
      })
      .catch((error) => console.error(error));
  }
  try {
    await fetch("untag.css")
      .then((response) => response.text())
      .then((text) => {
        ARTAGGED = text;
        console.dir("Active Recall Untagged Installed from local");
      })
      .catch((error) => console.error(error));
  } catch (localError) {
    await fetch("https://raw.githubusercontent.com/browneyedsoul/RemNote-ActiveRecall/main/src/untag.css")
      .then((response) => response.text())
      .then((text) => {
        ARTAGGED = text;
        console.dir("Active Recall Untagged Installed from CDN");
      })
      .catch((error) => console.error(error));
  }
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
  // unregisterCSS needed
  await plugin.track(async (reactivePlugin) => {
    let arSetting = await reactivePlugin.settings.getSetting<boolean>("scope");
    arSetting === true
      ? plugin.app.registerCSS("active-recall-untagged", ARTAGGED)
      : plugin.app.registerCSS("active-recall-untagged", ARCSS);
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
