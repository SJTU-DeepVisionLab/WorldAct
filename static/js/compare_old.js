function selectCompVideo(element) {
  element.parentElement.getElementsByClassName("is-selected")[0].classList.remove("is-success", "is-selected");
  element.classList.add("is-success", "is-selected");

  let parent = element.parentElement.parentElement;
  let videoId = parent.getAttribute("id") + "-video";
  let imageId = parent.getAttribute("id") + "-image";
  let canvasId = parent.getAttribute("id") + "-canvas";
  // let colmap = parent.getElementsByClassName("colmap-buttons")[0].getElementsByClassName("is-selected")[0].getAttribute("value");
  let methodName = parent.getElementsByClassName("method-buttons")[0].getElementsByClassName("is-selected")[0].getAttribute("value");
  let sceneName = parent.getElementsByClassName("scene-buttons").length == 0 ? "omni3d_dinosaur_006" : parent.getElementsByClassName("scene-buttons")[0].getElementsByClassName("is-selected")[0].getAttribute("value");

  let video = document.getElementById(videoId);
  let image = document.getElementById(imageId);
  let canvas = document.getElementById(canvasId);

  canvas.replaceWith(canvas.cloneNode(true));

  // video.src = "static/videos/comparison/" + sceneName + "_4_" + methodName + "_" + colmap + ".mp4";
  video.src = "static/videos/comparison/" + sceneName + "_4_" + methodName + ".mp4";
  image.src = "static/images/comparison/" + sceneName + "_4.png";;
  video.onloadeddata = () => {
    resizeAndPlay(video);
  };
  video.load();
}

function playVids(videoId) {
  let canvas = document.getElementById(videoId.replace('video', 'canvas'));
  let video = document.getElementById(videoId);

  let position = 0.5;
  let vidWidth = video.videoWidth / 2;
  let vidHeight = video.videoHeight;

  let mergeContext = canvas.getContext("2d");

  if (video.readyState > 3) {
    video.play();

    function trackLocation(e) {
      // Normalize to [0, 1]
      bcr = canvas.getBoundingClientRect();
      position = (e.pageX - bcr.x) / bcr.width;
    }
    function trackLocationTouch(e) {
      // Normalize to [0, 1]
      bcr = canvas.getBoundingClientRect();
      position = (e.touches[0].pageX - bcr.x) / bcr.width;
    }

    canvas.addEventListener("mousemove", trackLocation, false);
    canvas.addEventListener("touchstart", trackLocationTouch, false);
    canvas.addEventListener("touchmove", trackLocationTouch, false);

    function drawLoop() {
      mergeContext.drawImage(video, 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);
      let colStart = (vidWidth * position).clamp(0.0, vidWidth);
      let colWidth = (vidWidth - vidWidth * position).clamp(0.0, vidWidth);
      mergeContext.drawImage(video, colStart + vidWidth, 0, colWidth, vidHeight, colStart, 0, colWidth, vidHeight);
      requestAnimationFrame(drawLoop);

      let arrowLength = 0.09 * vidHeight;
      let arrowheadWidth = 0.025 * vidHeight;
      let arrowheadLength = 0.04 * vidHeight;
      let arrowPosY = vidHeight / 10;
      let arrowWidth = 0.007 * vidHeight;
      let currX = vidWidth * position;

      // Draw circle
      mergeContext.arc(currX, arrowPosY, arrowLength * 0.7, 0, Math.PI * 2, false);
      mergeContext.fillStyle = "#FFD79340";
      mergeContext.fill();
      //mergeContext.strokeStyle = "#444444";
      //mergeContext.stroke()

      // Draw border
      mergeContext.beginPath();
      mergeContext.moveTo(vidWidth * position, 0);
      mergeContext.lineTo(vidWidth * position, vidHeight);
      mergeContext.closePath();
      mergeContext.strokeStyle = "#444444";
      mergeContext.lineWidth = 5;
      mergeContext.stroke();

      // Draw arrow
      mergeContext.beginPath();
      mergeContext.moveTo(currX, arrowPosY - arrowWidth / 2);

      // Move right until meeting arrow head
      mergeContext.lineTo(
        currX + arrowLength / 2 - arrowheadLength / 2,
        arrowPosY - arrowWidth / 2
      );

      // Draw right arrow head
      mergeContext.lineTo(
        currX + arrowLength / 2 - arrowheadLength / 2,
        arrowPosY - arrowheadWidth / 2
      );
      mergeContext.lineTo(currX + arrowLength / 2, arrowPosY);
      mergeContext.lineTo(
        currX + arrowLength / 2 - arrowheadLength / 2,
        arrowPosY + arrowheadWidth / 2
      );
      mergeContext.lineTo(
        currX + arrowLength / 2 - arrowheadLength / 2,
        arrowPosY + arrowWidth / 2
      );

      // Go back to the left until meeting left arrow head
      mergeContext.lineTo(
        currX - arrowLength / 2 + arrowheadLength / 2,
        arrowPosY + arrowWidth / 2
      );

      // Draw left arrow head
      mergeContext.lineTo(
        currX - arrowLength / 2 + arrowheadLength / 2,
        arrowPosY + arrowheadWidth / 2
      );
      mergeContext.lineTo(currX - arrowLength / 2, arrowPosY);
      mergeContext.lineTo(
        currX - arrowLength / 2 + arrowheadLength / 2,
        arrowPosY - arrowheadWidth / 2
      );
      mergeContext.lineTo(
        currX - arrowLength / 2 + arrowheadLength / 2,
        arrowPosY
      );

      mergeContext.lineTo(
        currX - arrowLength / 2 + arrowheadLength / 2,
        arrowPosY - arrowWidth / 2
      );
      mergeContext.lineTo(currX, arrowPosY - arrowWidth / 2);

      mergeContext.closePath();

      mergeContext.fillStyle = "#444444";
      mergeContext.fill();
    }
    requestAnimationFrame(drawLoop);
  }
}

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

function resizeAndPlay(element) {
  let canvas = document.getElementById(element.id.replace('video', 'canvas'));
  let image = document.getElementById(element.id.replace('video', 'image'));
  image.width = image.width / image.height * element.videoHeight;
  image.height = element.videoHeight;
  canvas.width = element.videoWidth / 2;
  canvas.height = element.videoHeight;
  element.play();
  element.style.height = "0px";
  playVids(element.id);
}
