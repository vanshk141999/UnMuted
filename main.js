const { app, Tray, Menu, globalShortcut } = require("electron");
const notifier = require("node-notifier");
const path = require("path");

let tray = null;
let isMuted = false;

const { ipcMain } = require("electron");

ipcMain.on("mute-mic", () => {
  toggleMicrophone(true);
});

ipcMain.on("unmute-mic", () => {
  toggleMicrophone(false);
});

function createTray() {
  tray = new Tray(getIcon());
  tray.setToolTip("Microphone Control");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Mute Microphone",
      // type: "checkbox",
      // checked: false,
      click: () => {
        toggleMicrophone(true);
      },
    },
    {
      label: "Unmute Microphone",
      // type: "checkbox",
      // checked: false,
      click: () => {
        toggleMicrophone(false);
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  globalShortcut.register("Ctrl+Shift+M", () => {
    toggleMicrophone(!isMuted);
  });
}

function getIcon() {
  if (isMuted) {
    return path.join(__dirname, "mute-microphone.png");
  } else {
    return path.join(__dirname, "microphone.png");
  }
}

function toggleMicrophone(mute) {
  const exec = require("child_process").exec;

  if (mute) {
    exec('osascript -e "set volume input volume 0"');
    notifier.notify({
      title: "Microphone Control",
      message: "Microphone muted",
    });
    isMuted = true;
  } else {
    exec('osascript -e "set volume input volume 100"');
    notifier.notify({
      title: "Microphone Control",
      message: "Microphone unmuted",
    });
    isMuted = false;
  }

  tray.setImage(getIcon());
}

app.whenReady().then(() => {
  createTray();
});
