$(document).ready(function() {

    $("#learnmore__btn_id").magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        callbacks: {
            open: function(){
                if(ga){
                    ga('send', 'event', 'button', 'click', 'learnmore_clicked');
                }
            }
        }
    });

    $.ajax({url:"http://mygene.info/metadata",success:function(result){
    $("#metadata_timestamp").html('Data last updated: <a href="http://mygene.info/metadata">' + result.timestamp.split('T')[0] + "</a>");
  }});

});