const express = require('express');
const Procurement = require('../models/procurement');

// middlewares to handle authentication and authorization
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/procurements:
 *   post:
 *     summary: Create a new procurement record
 *     description: Creates and saves a new procurement record in the database.
 *     tags:
 *       - Procurement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *               - supplier
 *               - price
 *             properties:
 *               product:
 *                 type: string
 *                 example: Rice 5kg
 *               quantity:
 *                 type: number
 *                 example: 20
 *               supplier:
 *                 type: string
 *                 example: ABC Suppliers Ltd
 *               price:
 *                 type: number
 *                 example: 4500
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-14
 *               paymentMethod:
 *                 type: string
 *                 example: Cash
 *     responses:
 *       201:
 *         description: Procurement record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Procurement record created successfully
 *                 procurement:
 *                   type: object
 *       400:
 *         description: Bad request (validation error)
 *       500:
 *         description: Server error
 */

router.post('/', authMiddleware, roleMiddleware('Manager'),async (req, res, next) => {
    let body = req.body;
    try {
        const procurement = new Procurement(body);
        await procurement.save();
        res.status(201).json({ 
            message: 'Procurement record created successfully', 
            createdRecord:  procurement
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /procurement:
 *   get:
 *     summary: Get all procurement records
 *     description: Fetches all produce procurement records recorded by Managers.
 *     tags: [Procurement]
 *     responses:
 *       200:
 *         description: Procurement records successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: procurement records successfully fetched
 *                 AllRecords:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 65f2a8c91c4b2f0012345678
 *                       produceName:
 *                         type: string
 *                         example: Tomatoes
 *                       produceType:
 *                         type: string
 *                         example: Fresh
 *                       date:
 *                         type: string
 *                         example: 2026-02-14
 *                       time:
 *                         type: string
 *                         example: 10:30 AM
 *                       tonnage:
 *                         type: number
 *                         example: 500
 *                       cost:
 *                         type: number
 *                         example: 150000
 *                       dealerName:
 *                         type: string
 *                         example: John Traders
 *                       branch:
 *                         type: string
 *                         example: Maganjo
 *                       contact:
 *                         type: string
 *                         example: 0700123456
 *                       sellingPrice:
 *                         type: number
 *                         example: 200000
 *       404:
 *         description: No procurement record found
 *       400:
 *         description: Error fetching procurement records
 */

router.get('/', async (req, res) => {
    let procurementRecords = await Procurement.find();
    try {
        if (!procurementRecords || procurementRecords.length === 0) {
           return res.status(404).send("No procurement record found");
        }

        res.status(200).json({
             message: "procurement records successfully fetched", 
             AllRecords: procurementRecords 
        });

    } catch (error) {
        res.status(400).json({ 
            message: "Error fetching procurement records", 
            details: error.message 
        });
    }
})

/**
 * @swagger
 * /procurement/{id}:
 *   get:
 *     summary: Get a single procurement record by ID
 *     description: Fetch a specific procurement record using its MongoDB ID.
 *     tags: [Procurement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB ID of the procurement record
 *         schema:
 *           type: string
 *           example: 65f2a8c91c4b2f0012345678
 *     responses:
 *       200:
 *         description: Procurement record found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mesage:
 *                   type: string
 *                   example: procurement record with id 65f2a8c91c4b2f0012345678 found successfully
 *                 Record:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65f2a8c91c4b2f0012345678
 *                     produceName:
 *                       type: string
 *                       example: Tomatoes
 *                     produceType:
 *                       type: string
 *                       example: Fresh
 *                     date:
 *                       type: string
 *                       example: 2026-02-14
 *                     time:
 *                       type: string
 *                       example: 10:30 AM
 *                     tonnage:
 *                       type: number
 *                       example: 500
 *                     cost:
 *                       type: number
 *                       example: 150000
 *                     dealerName:
 *                       type: string
 *                       example: John Traders
 *                     branch:
 *                       type: string
 *                       example: Maganjo
 *                     contact:
 *                       type: string
 *                       example: 0700123456
 *                     sellingPrice:
 *                       type: number
 *                       example: 200000
 *       404:
 *         description: Procurement record not found
 *       400:
 *         description: Error finding record (Invalid ID format or server error)
 */

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        procurementRecord = await Procurement.findById(id);
        if (!procurementRecord) {
            return res.status(404).json({ 
                message: `Procurement record with id ${id} not found` 
            })
        }
        res.status(200).json({ 
            mesage: `procurement record with id ${id} found successfully`,
            Record: procurementRecord 
        })
    } catch (error) {
        res.status(400).json({ message: 'Error finding record', details: error.message })
    }
});

/**
 * @swagger
 * /procurement/{id}:
 *   patch:
 *     summary: Update a procurement record by ID
 *     description: Updates an existing procurement record using its MongoDB ID. Only provided fields will be updated.
 *     tags: [Procurement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB ID of the procurement record
 *         schema:
 *           type: string
 *           example: 65f2a8c91c4b2f0012345678
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produceName:
 *                 type: string
 *                 example: Onions
 *               produceType:
 *                 type: string
 *                 example: Red
 *               date:
 *                 type: string
 *                 example: 2026-02-14
 *               time:
 *                 type: string
 *                 example: 11:00 AM
 *               tonnage:
 *                 type: number
 *                 example: 700
 *               cost:
 *                 type: number
 *                 example: 200000
 *               dealerName:
 *                 type: string
 *                 example: Fresh Farm Ltd
 *               branch:
 *                 type: string
 *                 enum: [Maganjo, Matugga]
 *                 example: Matugga
 *               contact:
 *                 type: string
 *                 example: 0700123456
 *               sellingPrice:
 *                 type: number
 *                 example: 250000
 *     responses:
 *       200:
 *         description: Procurement record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Procurement record with id 65f2a8c91c4b2f0012345678 updated successfully
 *                 updatedRecord:
 *                   type: object
 *       404:
 *         description: Record not found
 *       400:
 *         description: Error updating record (validation or invalid ID)
 */

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    let body = req.body
    try {
        let patchedRecord = await Procurement.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!patchedRecord) {
            return res.status(404).send(`record with id ${id} not found`);
        }

        res.status(200).json({
            message: `Procurement record with id ${id} updated successfully`,
            updatedRecord: patchedRecord
        });

    } catch (error) {
        res.status(400).json({
            message: "Error finding record",
            details: error.message
        });
    }

});

/**
 * @swagger
 * /procurement/{id}:
 *   delete:
 *     summary: Delete a procurement record by ID
 *     description: Deletes a specific procurement record from the database using its MongoDB ID.
 *     tags: [Procurement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB ID of the procurement record to delete
 *         schema:
 *           type: string
 *           example: 65f2a8c91c4b2f0012345678
 *     responses:
 *       200:
 *         description: Procurement record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: procurement record with id 65f2a8c91c4b2f0012345678 deleted successfully
 *                 deletedRecord:
 *                   type: object
 *                   description: The deleted procurement record
 *       404:
 *         description: Procurement record not found
 *       400:
 *         description: Error deleting record (Invalid ID format or server error)
 */

router.delete('/:id', async(req, res) =>{
    const id = req.params.id;
    try{
        const deletedRecord = await Procurement.findByIdAndDelete(id);
        if(!deletedRecord){
            return  res.status(404).json({
                           message: `procurement record with id ${id} not found`
                        })
        }

        res.status(200).json({
            message: `procurement record with id ${id} deleted successfully`,
            deletedRecord: deletedRecord
        })
    }catch(error){
        res.status(400).json({
            message: "Error deleting record",
            details: error.message
        })
    }
});


module.exports = router;