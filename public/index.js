
$('[name="login-form"]').on('submit', function() {
  console.log("here");
  var form = $(this);
  $('.error', form).html('');
  $.ajax({
    url: "/login",
    method: "POST",
    data: form.serialize(),
    success:function(data){
      if(data.login){
        window.location.href = "/home.html";
      }else{
        alert('incorrect response');
      }

    }
  });
  return false;
});
