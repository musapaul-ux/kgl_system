const express = require('express');
const  saleSchema  = require('../models/sale');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale record
 *     description: Creates and saves a new sale record in the database.
 *     tags:
 *       - Sales
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *               - price
 *               - totalAmount
 *             properties:
 *               product:
 *                 type: string
 *                 example: Sugar 1kg
 *               quantity:
 *                 type: number
 *                 example: 5
 *               price:
 *                 type: number
 *                 example: 3500
 *               totalAmount:
 *                 type: number
 *                 example: 17500
 *               customerName:
 *                 type: string
 *                 example: John Doe
 *               paymentMethod:
 *                 type: string
 *                 example: Cash
 *     responses:
 *       201:
 *         description: Sale record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sale record created successfully
 *                 sale:
 *                   type: object
 *       400:
 *         description: Bad request (validation error)
 *       500:
 *         description: Server error
 */

router.post('/',authMiddleware, roleMiddleware('SalesAgent'), async (req, res, next) =>{
    let body = req.body;
    try{
        const sale = new saleSchema(body);
        await sale.save();
        res.status(201).json({message: 'Sale record created successfully', sale});  
    }catch(error){
        console.error('Error creating sale record:', error);
        next(error);
    }
});

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Retrieve all sales records
 *     description: Fetches all sale records from the database.
 *     tags:
 *       - Sales
 *     responses:
 *       200:
 *         description: Sales successfully loaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: sales successfully loaded
 *                 sales:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 65f1c1a8e4b0a123456789ab
 *                       product:
 *                         type: string
 *                         example: Sugar 1kg
 *                       quantity:
 *                         type: number
 *                         example: 5
 *                       price:
 *                         type: number
 *                         example: 3500
 *                       totalAmount:
 *                         type: number
 *                         example: 17500
 *                       customerName:
 *                         type: string
 *                         example: John Doe
 *                       paymentMethod:
 *                         type: string
 *                         example: Cash
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-02-14T10:30:00.000Z
 *       400:
 *         description: Error fetching sales
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try{
        const sales = await saleSchema.find();
        res.status(200).json({message: "sales successfully loaded", sales});
    }catch(error){
        res.status(400).json({Error:"Error fetching sales", details: error.message});
    }
})

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Retrieve a single sale record by ID
 *     description: Fetches a specific sale record using its MongoDB ID.
 *     tags:
 *       - Sales
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the sale record
 *         schema:
 *           type: string
 *           example: 65f1c1a8e4b0a123456789ab
 *     responses:
 *       200:
 *         description: Sale found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sale found successfully
 *                 sale:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65f1c1a8e4b0a123456789ab
 *                     product:
 *                       type: string
 *                       example: Sugar 1kg
 *                     quantity:
 *                       type: number
 *                       example: 5
 *                     price:
 *                       type: number
 *                       example: 3500
 *                     totalAmount:
 *                       type: number
 *                       example: 17500
 *                     customerName:
 *                       type: string
 *                       example: John Doe
 *                     paymentMethod:
 *                       type: string
 *                       example: Cash
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-02-14T10:30:00.000Z
 *       400:
 *         description: Sale not found or invalid ID
 *       500:
 *         description: Server error
 */

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const sale = await saleSchema.findById(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json({ message: "Sale found successfully", sale });
    } catch (error) {
        res.status(400).json({ 
            message: `Fetching sale with id ${id} failed`, 
            error: error.message 
        });
    }
});

/**
 * @swagger
 * /api/sales/{id}:
 *   patch:
 *     summary: Update a sale record by ID
 *     description: Updates an existing sale record using its MongoDB ID.
 *     tags:
 *       - Sales
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the sale record
 *         schema:
 *           type: string
 *           example: 65f1c1a8e4b0a123456789ab
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 example: Sugar 1kg
 *               quantity:
 *                 type: number
 *                 example: 10
 *               price:
 *                 type: number
 *                 example: 3500
 *               totalAmount:
 *                 type: number
 *                 example: 35000
 *               customerName:
 *                 type: string
 *                 example: Jane Doe
 *               paymentMethod:
 *                 type: string
 *                 example: Mobile Money
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: sale with id 65f1c1a8e4b0a123456789ab updated
 *                 updatedSale:
 *                   type: object
 *       404:
 *         description: Sale not found
 *       400:
 *         description: Error updating sale
 *       500:
 *         description: Server error
 */

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
        const updatedSale = await saleSchema.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json({
            message: `Sale with id ${id} updated`,
            updatedSale
        });

    } catch (error) {
        res.status(400).json({
            message: 'Error updating sale',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete a sale record by ID
 *     description: Deletes an existing sale record using its MongoDB ID.
 *     tags:
 *       - Sales
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the sale record
 *         schema:
 *           type: string
 *           example: 65f1c1a8e4b0a123456789ab
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: sale with id 65f1c1a8e4b0a123456789ab deleted successfully
 *                 deletedSale:
 *                   type: object
 *       404:
 *         description: Sale not found
 *       400:
 *         description: Error deleting sale record
 *       500:
 *         description: Server error
 */

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedSale = await saleSchema.findByIdAndDelete(id);

        if (!deletedSale) {
            return res.status(404).json({
                message: `Sale with id ${id} not found`
            });
        }

        res.status(200).json({
            message: `Sale with id ${id} deleted successfully`,
            deletedSale
        });

    } catch (error) {
        res.status(400).json({
            message: 'Error deleting sale record',
            error: error.message
        });
    }
});


module.exports = router;