'use strict';

module.exports = (capability) => {

  return (req, res, next) => {

    try {
      // make sure the capability is in the array of capabilities
      if (req.user.capabilities.includes(capability)) {
        next();
      }
      else {
        next('Access Denied');
      }
    } catch (e) {
      next('Invalid Login');
    }

  };

};
