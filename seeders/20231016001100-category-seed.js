'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Men Wear',
        slug: 'men-wear',
        description: 'Clothing for men',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Women Wear',
        slug: 'women-wear',
        description: 'Clothing for women',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
