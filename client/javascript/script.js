

$('.charSelect').on('change', function() {
   var char = $('option:selected',this).val();
    $('.CharImg').attr('src',window.gameConfig.spriteInfo[char]);
});

$('.charBtn').on('click', function() {
    $('.charSelect').hide();
    var ava = $('.charSelect option:selected').val();
    var nick = $('#username').val();
    game.setupBoard(ava, nick);
});