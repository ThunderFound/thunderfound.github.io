// Constants defining canvas properties and point distribution
const canvasResolution = 2;
const numPoints = 1000;
const boundaryPointsRatio = 50;
const pointOpacity = 0.5;
const pointOutlines = false;
const polygonOpacity = 0.75;
const minSpeed = 0.0001;
const maxSpeed = 0.0005;
const useDynamicRadius = false; // Looks very bad
const minDynamicRadius = 1;
const maxDynamicRadius = 3;
const staticRadius = 2;

// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Function to generate random coordinates within specified bounds
function generateRandomCoordinates(minX, minY, maxX, maxY, count) {
  return Array.from({ length: count }, () => [Math.random() * (maxX - minX) + minX, Math.random() * (maxY - minY) + minY]);
}

// Function to calculate distance between two points
function calculateDistance(point1, point2) {
  const dx = point1[0] - point2[0];
  const dy = point1[1] - point2[1];
  return Math.sqrt(dx * dx + dy * dy);
}

// Function to draw a single point on the canvas
function drawPoint(x, y, radius) {
  ctx.fillStyle = `rgba(255, 255, 255, ${pointOpacity})`;
  ctx.strokeStyle = "rgba(0, 0, 0, 1)";
  ctx.lineWidth = canvasResolution;
  ctx.beginPath();
  ctx.arc(x * canvas.width, y * canvas.height, radius * canvasResolution, 0, Math.PI * 2);
  ctx.fill();
  if (pointOutlines) {
    ctx.stroke();
  }
}

// Function to draw a polygon on the canvas
function drawPolygon(points, strokeOnly = false) {
  const averageY = points.reduce((sum, [, y]) => sum + y, 0) / points.length;
  const grayScaleValue = Math.floor(polygonOpacity * (averageY * 255) + (1 - polygonOpacity) * 255);
  ctx.fillStyle = `rgb(${grayScaleValue}, ${grayScaleValue}, ${grayScaleValue})`;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 0.2;
  ctx.beginPath();
  ctx.moveTo(points[0][0] * canvas.width, points[0][1] * canvas.height);
  points.forEach(([x, y]) => ctx.lineTo(x * canvas.width, y * canvas.height));
  ctx[strokeOnly ? "stroke" : "fill"]();
}

// Function to resize the canvas to fit the browser window
function resizeCanvas() {
  const maxDimension = Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight);
  canvas.width = maxDimension * canvasResolution;
  canvas.height = maxDimension * canvasResolution;
}

// Function to animate the points and redraw the triangulation
function animatePoints(initialPoints, pointSpeeds, pointDirections) {
  requestAnimationFrame(() => animatePoints(initialPoints, pointSpeeds, pointDirections));
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const numBoundaryPoints = 4 + Math.ceil(numPoints / boundaryPointsRatio) * 4;

  // Update point positions
  for (let i = numBoundaryPoints; i < initialPoints.length; i++) {
    const [x, y] = initialPoints[i];
    const speed = pointSpeeds[i];
    const direction = pointDirections[i];
    const dx = speed * Math.cos(direction);
    const dy = speed * Math.sin(direction);
    initialPoints[i] = [(x + dx) % 1, (y + dy) % 1];
  }

  // Delaunay triangulation using d3-delaunay
  const { points, triangles } = d3.Delaunay.from(initialPoints);

  // Draw triangles
  function drawTriangle(i) {
    const triangle = [points.slice(triangles[i] * 2, triangles[i] * 2 + 2), points.slice(triangles[i + 1] * 2, triangles[i + 1] * 2 + 2), points.slice(triangles[i + 2] * 2, triangles[i + 2] * 2 + 2)];
    drawPolygon(triangle);
    drawPolygon(triangle, true);
  }

  for (let i = 0; i < triangles.length; i += 3) {
    drawTriangle(i);
  }

  // Draw points with dynamic or static radius
  initialPoints.forEach((point, index) => {
    let radius;
    if (useDynamicRadius) {
      //Find connected lines and calculate average length.  This is a simplification and could be improved for accuracy
      let totalLength = 0;
      let connectionCount = 0;
      for (let i = 0; i < triangles.length; i++) {
        if (triangles[i] === index || triangles[i + 1] === index || triangles[i + 2] === index) {
          const p1Index = triangles[i];
          const p2Index = triangles[i + 1];
          const p3Index = triangles[i + 2];

          totalLength += calculateDistance(points.slice(p1Index * 2, p1Index * 2 + 2), points.slice(p2Index * 2, p2Index * 2 + 2));
          totalLength += calculateDistance(points.slice(p2Index * 2, p2Index * 2 + 2), points.slice(p3Index * 2, p3Index * 2 + 2));
          totalLength += calculateDistance(points.slice(p3Index * 2, p3Index * 2 + 2), points.slice(p1Index * 2, p1Index * 2 + 2));
          connectionCount += 3;
        }
      }
      // Math.max(minDynamicRadius, Math.min(maxDynamicRadius, (totalLength / connectionCount) * 50))
      radius = (totalLength / 20) * maxDynamicRadius; // Scale the average length to a reasonable radius
    } else {
      radius = staticRadius;
    }
    drawPoint(point[0], point[1], radius);
  });
}

// Function to initialize and start the animation
function initializeAndStartAnimation() {
  resizeCanvas();
  const numBoundaryPoints = Math.ceil(numPoints / boundaryPointsRatio);

  const initialPoints = [[0, 0], [0, 1], [1, 0], [1, 1], ...Array.from({ length: numBoundaryPoints }, () => [0, Math.random()]), ...Array.from({ length: numBoundaryPoints }, () => [Math.random(), 0]), ...Array.from({ length: numBoundaryPoints }, () => [1, Math.random()]), ...Array.from({ length: numBoundaryPoints }, () => [Math.random(), 1]), ...generateRandomCoordinates(0, 0, 1, 1, numPoints)];

  const pointSpeeds = Array.from({ length: initialPoints.length }, () => Math.random() * (maxSpeed - minSpeed) + minSpeed);
  const pointDirections = Array.from({ length: initialPoints.length }, () => Math.random() * 2 * Math.PI);
  animatePoints(initialPoints, pointSpeeds, pointDirections);
}

// Start the animation if the canvas context is available
if (ctx) {
  initializeAndStartAnimation();
}
