$(document).ready(function()
{
    $('.deleteuser').on('click', deleteUser);
});

function deleteUser()
{
    var confirmation = confirm("Are you sure you want to delete this user?");

    if(confirmation)
    {
        $.ajax(
        {
            type: 'DELETE',
            url: '/users/delete/'+$(this).data('id')
        }).done(function(response){});
        window.location.replace('/');
    }
    else { return false; }
}
