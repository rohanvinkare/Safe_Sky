document.getElementById('warningButton').addEventListener('click', function() {
    document.getElementById('warningOverlay').style.display = 'flex';
  });
  
  document.getElementById('warningOverlay').addEventListener('click', function(e) {
    if (e.target.id === 'warningOverlay') {
      document.getElementById('warningOverlay').style.display = 'none';
    }
  });
  