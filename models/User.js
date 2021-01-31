/* jshint indent: 1 */
require('dotenv').config();
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'first_name'
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'last_name'
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: false,
	  unique: {
                    msg:
                        'Oops. Looks like you already have an account with this email address. Please try to login.',
                },
                validate: {
                    isEmail: {
                        msg:
                            'The email you entered is invalid.',
                    },
                },
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'password'
    },
    image: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'image'
    },
    phone_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'phone_number'
    },
    gender: {
      type: DataTypes.ENUM,
      allowNull: true,
	  values: ['male', 'female'],
                validate: {
                    isIn: {
                        args: [['male', 'female']],
                        msg: 'Invalid gender',
                    },
                },
    },
    status: {
      type: DataTypes.ENUM,
		values: ['active', 'blocked', 'deleted'],
		defaultValue: 'active',
		validate: {
			isIn: {
				args: [['active', 'suspended', 'inactive']],
				msg: 'Invalid status',
			},
		},
    },
    user_type: {
      type: DataTypes.ENUM,
	  values: ['user', 'employee', 'admin'],
	  defaultValue: 'user',
	  validate: {
			isIn: {
				args: [['user', 'employee', 'admin']],
				msg: 'Invalid user type',
			},
		},
    },

  }, 
  {
    getterMethods: {
        image: function () {
            return this.getDataValue('image')!= null ? process.env.baseUrl+"/image/"+this.getDataValue('image') : ''
        }
    }, 
  },
    {
    tableName: 'users'
  });
  
   User.associate = models => {
        User.hasMany(models.bookings);
      };
    return USer;
	
};
