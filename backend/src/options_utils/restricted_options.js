const restriction_policies = [
  {
    userType: "any",
    options: {
      time_limit: {
        maxValue: 60
      },
      memory_limit: {
        maxValue: 3000
      },
      cores: {
        maxValue: 1
      },
      latex_output: true,
      ltb_directory: true,
      include: true
    }
  }
]

function appendRestrictions(userType, options) {
  let restricted = restriction_policies.find(rp => rp.userType === userType);
  if (!restricted) restricted = restriction_policies.find(rp => rp.userType === "any");

  return options.map(option => {
    if (restricted.options[option.name]) {
      return {
        ...option,
        restriction: restricted.options[option.name]
      }
    }
    else {
      return { ...option }
    }
  });
}

exports.appendRestrictions = appendRestrictions;

