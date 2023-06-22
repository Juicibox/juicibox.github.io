document.addEventListener("DOMContentLoaded", function() {
  var startCameraButton = document.getElementById('startCameraButton');
  var stopCameraButton = document.getElementById('stopCameraButton');
  var canvas = document.getElementById('gameCanvas');
  var context = canvas.getContext('2d');
  var video = document.createElement('video');
  var objectX = 0;
  var objectY = 0;
  var score = 0;

  var hoop = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 40
  };

  var stream = null;

  startCameraButton.addEventListener('click', function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(mediaStream) {
          stream = mediaStream;
          video.srcObject = stream;
          video.play();

          webgazer.setGazeListener(function(data, elapsedTime) {
            if (data) {
              var x = data.x; // Coordenada x de la mirada
              var y = data.y; // Coordenada y de la mirada

              // Controlar la posición del objeto basado en la mirada
              // Por ejemplo, mover un objeto en el canvas
              var canvasRect = canvas.getBoundingClientRect();
              var canvasX = canvasRect.left;
              var canvasY = canvasRect.top;
              var canvasWidth = canvasRect.width;
              var canvasHeight = canvasRect.height;

              objectX = (x - canvasX) * (canvasWidth - 100) / canvasWidth;
              objectY = (y - canvasY) * (canvasHeight - 100) / canvasHeight;

              // Verificar si el objeto atraviesa el aro
              if (
                objectX + 100 >= hoop.x - hoop.radius &&
                objectX <= hoop.x + hoop.radius &&
                objectY + 100 >= hoop.y - hoop.radius &&
                objectY <= hoop.y + hoop.radius
              ) {
                score++;
                hoop.x = Math.random() * (canvas.width - hoop.radius * 2) + hoop.radius;
                hoop.y = Math.random() * (canvas.height - hoop.radius * 2) + hoop.radius;
              }
            }
          }).begin();
        })
        .catch(function(error) {
          console.error('Error al acceder a la cámara:', error);
        });

      // Actualizar el estado del botón de la cámara
      startCameraButton.disabled = true;
      stopCameraButton.disabled = false;
    } else {
      console.error('El navegador no admite la API getUserMedia');
    }
  });

  stopCameraButton.addEventListener('click', function() {
    if (stream && stream.getTracks) {
      stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }
    webgazer.end();

    // Actualizar el estado del botón de la cámara
    startCameraButton.disabled = false;
    stopCameraButton.disabled = true;
  });

  // Lógica del juego
  function gameLoop() {
    // Actualizar el estado del juego

    // Dibujar el estado del juego en el canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#1c2163';
    context.fillRect(objectX, objectY, 100, 100);

    // Dibujar el aro
    context.beginPath();
    context.arc(hoop.x, hoop.y, hoop.radius, 0, Math.PI * 2);
    context.fillStyle = '#484747';
    context.fill();
    context.closePath();

    // Dibujar el puntaje
    context.font = '24px Arial';
    context.fillStyle = 'black';
    context.fillText('Puntaje: ' + score, 10, 30);

    // Repetir el ciclo del juego
    requestAnimationFrame(gameLoop);
  }

  // Iniciar el juego
  gameLoop();
});
