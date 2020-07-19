const restriction_policies = [
  {
    userType: "sudo",
    time_limit: {
      minValue: 0,
    },
    memory_limit: {
      minValue: 0,
    },
    cores: {
      minValue: 0,
    },
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
        minValue: 0.01,
        maxValue: 60
      },
      memory_limit: {
        minValue: 1,
        maxValue: 3000
      },
      cores: {
        minValue: 1,
        maxValue: 1
      },
      latex_output: true,
      ltb_directory: true,
      include: true
    }
  }
]

exports.restriction_policies = restriction_policies;

