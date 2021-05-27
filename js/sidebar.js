$(document).ready(function(){
    // when menu button pressed sidebar menu fades in 
    $("#menuButton").on('mouseenter', function(){
        $("#menuButton").hide();
        $("#mySidebar").width("250px") ;
        $("body").css({marginLeft:'275px'});
    });
    // when mouse leaves sidebar, sidebar menu fades out
    $("#mySidebar").on('mouseleave', function(){
        $("#menuButton").show();
        $("#mySidebar").width("0") ;
        $("body").css({marginLeft:'.5em'});
    })
});