$(function() {
    $('#sprite').on('change', function () {
        var char = $('option:selected', this).val();
        $('.spriteImg').attr('src', window.gameConfig.spriteInfo[char]);
    });


    $('.charBtn').on('click', function(e) {
        e.preventDefault();
        $('.login').hide();
        $('.board').fadeIn( function() {
            var ava = $('#sprite option:selected').val();
            var nick = $('#nickname').val();
            game.setupBoard(ava, nick);
        });
    });

});