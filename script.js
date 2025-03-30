const videoElement = document.getElementById("video");
const button = document.getElementById("button");

// Prompt to select media stream, pass to video element, then play
async function selectMediaStream() {
  try {
    // Clear previous stream if exists
    if (videoElement.srcObject) {
      videoElement.srcObject.getTracks().forEach((track) => track.stop());
    }

    const mediaStream = await navigator.mediaDevices.getDisplayMedia();
    videoElement.srcObject = mediaStream;

    await new Promise((resolve) => {
      videoElement.onloadedmetadata = resolve;
    });

    videoElement.play();
  } catch (error) {
    console.error("Error accessing media devices: ", error);
    button.disabled = false;
  }
}

button.addEventListener("click", async () => {
  try {
    button.disabled = true;

    // Check if Picture-in-Picture is available
    if (!("pictureInPictureEnabled" in document)) {
      throw new Error("Picture-in-Picture is not available in this browser");
    }
    await videoElement.requestPictureInPicture();
  } catch (error) {
    console.error("Error entering Picture-in-Pictire: ", error);
  } finally {
    button.disabled = false;
  }
});

videoElement.addEventListener("leavepictureinpicture", () => {
  button.disabled = false;
});

// Initialize
selectMediaStream().catch((error) => {
  console.log("Initialization error: ", error);
});
