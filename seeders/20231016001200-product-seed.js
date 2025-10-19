'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Products', [
      {
        title: 'Blue T-Shirt',
        slug: 'blue-tshirt',
        description: 'Comfortable cotton blue t-shirt',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Red Dress',
        slug: 'red-dress',
        description: 'Elegant red evening dress',
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
