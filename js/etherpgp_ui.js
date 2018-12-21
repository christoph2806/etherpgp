(function($) {
    "use strict";


    $('#btn-create-keys').click(async function() {

        $("p#key-exists").text('');
        const tx = await etherpgp.registerPGPKey()
            .catch(function(reason){
                $("p#key-exists").text('Your keys have been retrieved from IPFS');
            })
            .then(async function(result) {
                const key = await etherpgp.getPGPKey(etherpgp.account);
                $("textarea#display-private-key").val(key.privateKeyArmored);
                $("textarea#display-public-key").val(key.publicKeyArmored);
            })
    });



    $(".textarea-autoselect").focus(function() {
        var $this = $(this);
        $this.select();

        // Work around Chrome's little problem
        $this.mouseup(function() {
            // Prevent further mouseup intervention
            $this.unbind("mouseup");
            return false;
        });
    });



    $('#btn-encrypt-message').click(async function() {
        const message = $('textarea#message-to-encrypt').val();
        const recipient_account = $('input#recipient-account').val();
        const encrypted = await etherpgp.encryptMessage(message, recipient_account);
        $('textarea#pgp-encrypted-message').val(encrypted);
    });


    $('#btn-decrypt-message').click(async function() {
        const pgp_message = $('textarea#pgp-message-to-decrypt').val();
        const decrypted = await etherpgp.decryptMessage(pgp_message, etherpgp.account)
            .catch(function (reason) {
                $("p#decrypt-error").text(reason);
            });
        $('textarea#decrypted-message').val(decrypted);

    });


})(jQuery);
