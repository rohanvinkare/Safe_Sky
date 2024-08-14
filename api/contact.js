document.getElementById('contactfrm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting normally

    // Gather form data
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var comments = document.getElementById('comments').value;

    // Create mailto link
    var subject = 'User Feedback';
    var mailtoLink = 'mailto:safesky.by.vishist@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(comments);

    // Open default email client with prefilled data
    window.location.href = mailtoLink;
});