function selectCompImage(element) {
  element.parentElement.getElementsByClassName("is-selected")[0].classList.remove("is-success", "is-selected");
  element.classList.add("is-success", "is-selected");

  let parent = element.parentElement.parentElement;
  let imageId1 = parent.getAttribute("id") + "-image1";
  let imageId2 = parent.getAttribute("id") + "-image2";
  let canvasId = parent.getAttribute("id") + "-canvas";
  let methodName = parent.getElementsByClassName("method-buttons")[0].getElementsByClassName("is-selected")[0].getAttribute("value");
  let sceneName = parent.getElementsByClassName("scene-buttons").length == 0 ? "omni3d_dinosaur_006" : parent.getElementsByClassName("scene-buttons")[0].getElementsByClassName("is-selected")[0].getAttribute("value");

  let image1 = document.getElementById(imageId1);
  let image2 = document.getElementById(imageId2);

  image1.src = "static/images/comparison/" + sceneName + "_label/DAI.png";
  image2.src = "static/images/comparison/" + sceneName + '_label/' + methodName + ".png";
  image2.onload = () => {
    compareImages(imageId1, imageId2, canvasId);
  };
}

function compareImages(image1Id, image2Id, canvasId, resize=false) {
  console.log("Comparing images:", image1Id, image2Id, canvasId);
  let image1 = document.getElementById(image1Id);
  let image2 = document.getElementById(image2Id);
  let canvas = document.getElementById(canvasId);

  let ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  let aspectRatio = image1.naturalWidth / image1.naturalHeight;
  let fixedWidth = resize ? canvas.width : image1.naturalWidth;
  let fixedHeight = resize ? canvas.width / aspectRatio : image1.naturalHeight;

  canvas.width = fixedWidth;
  canvas.height = fixedHeight;

  let position = 0.5;

  canvas.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    position = (e.clientX - rect.left) / rect.width;
    drawImages();
  });

  canvas.addEventListener("touchmove", (e) => {
    let rect = canvas.getBoundingClientRect();
    position = (e.touches[0].clientX - rect.left) / rect.width;
    drawImages();
  });

  function drawImages() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(image1, 0, 0, fixedWidth, fixedHeight);

    let splitPoint = fixedWidth * position;
    ctx.drawImage(image2, image2.naturalWidth * position, 0, image2.naturalWidth * (1 - position), image2.naturalHeight, splitPoint, 0, fixedWidth - splitPoint, fixedHeight);

    ctx.beginPath();
    ctx.moveTo(splitPoint, 0);
    ctx.lineTo(splitPoint, fixedHeight);
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 5;
    ctx.stroke();

    drawArrow(ctx, splitPoint, fixedHeight / 2);
  }

  function drawArrow(ctx, x, y) {
    let arrowLength = 0.09 * fixedHeight;
    let arrowheadWidth = 0.025 * fixedHeight;
    let arrowheadLength = 0.04 * fixedHeight;
    let arrowWidth = 0.007 * fixedHeight;

    ctx.beginPath();
    ctx.arc(x, y, arrowLength * 0.7, 0, Math.PI * 2, false);
    ctx.fillStyle = "#FFD79340";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - arrowLength / 2, y - arrowWidth / 2);
    ctx.lineTo(x - arrowheadLength / 2, y - arrowWidth / 2);
    ctx.lineTo(x - arrowheadLength / 2, y - arrowheadWidth / 2);
    ctx.lineTo(x, y);
    ctx.lineTo(x - arrowheadLength / 2, y + arrowheadWidth / 2);
    ctx.lineTo(x - arrowheadLength / 2, y + arrowWidth / 2);
    ctx.lineTo(x - arrowLength / 2, y + arrowWidth / 2);
    ctx.closePath();
    ctx.fillStyle = "#444444";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + arrowLength / 2, y - arrowWidth / 2);
    ctx.lineTo(x + arrowheadLength / 2, y - arrowWidth / 2);
    ctx.lineTo(x + arrowheadLength / 2, y - arrowheadWidth / 2);
    ctx.lineTo(x, y);
    ctx.lineTo(x + arrowheadLength / 2, y + arrowheadWidth / 2);
    ctx.lineTo(x + arrowheadLength / 2, y + arrowWidth / 2);
    ctx.lineTo(x + arrowLength / 2, y + arrowWidth / 2);
    ctx.closePath();
    ctx.fillStyle = "#444444";
    ctx.fill();
  }

  drawImages();
}
