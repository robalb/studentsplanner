<?php
//WARNING
//this is a temporary file for php tests
//remove soon. don't stage for production
//
/* $ret =  password_verify('rasmuslerdorf','$2y$07$BCryptRequires22Chrcte/VlQH0piJtjXl.0t1XkA8pw9dMXTpOq'); */
/* if($ret){ */
/*   echo "y"; */
/* }else{ */
/*   echo "n"; */
/* } */


$options = [
      'cost' => 14,
    ];
echo password_hash(hash("sha256", "password"), PASSWORD_BCRYPT, $options);

