$(document).ready(function(){
    var email = $("#email");
    var password = $("#password");
    var form =$("#textForm");
    var elements = [email, password];
  
     // remove red highlighting once input changed
    $.each(elements, function() {
      $(this).on('keypress', function(){
          if($(this).hasClass("error")){
              $(this).removeClass("error");
          }
      })
    });
       // when attempting submit makes sure data is valid then sends async request to php to attempt to sign user in
      form.on('submit', function(e){
        e.preventDefault();
        var formdata = $(this).serialize();
        if(valid()){
            $.ajax({
                type: "post",
                url:  "../php/signIn.php",
                data: formdata
            }).done(function(data){
                if(data == "success"){
                    // add redirect to either add stock or mainview
                }
                $("#message").html(data);
            }).fail(function(jqXHR) {console.log("Error: " + jqXHR.status);});
        }
    });
    function valid(){
      var valid = true;
      for(i = 0; i < elements.length; i++ ){
          // if empty string highlight red
          if(!elements[i].val()){
              elements[i].addClass("error");
              valid = false;
              $("#message").html("All fields must be filled!");
          }
      }
      return valid;
    }
});
