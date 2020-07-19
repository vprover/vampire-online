const restriction_policies = [
  {
    userType: "sudo",
    options: {
      latex_output: true,
      ltb_directory: true,
      include: true,
    }
  },
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

exports.restriction_policies = restriction_policies;

