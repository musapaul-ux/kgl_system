const express = require('express');
const Procurement = require('../models/procurement');
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

router.post('/', async (req, res, next) => {
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

router.get('/', async (req, res) => {
    let procurementRecords = await Procurement.find();
    try {
        if (!procurementRecords) {
            res.status(404).send("No procurement record found");
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

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        procurementRecord = await Procurement.findById(id);
        if (!procurementRecord) {
            res.status(404).json({ 
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
            message: `Procurement record with id ${id} updated succussfully`,
            updatedRecord: patchedRecord
        });

    } catch (error) {
        res.status(400).json({
            messasge: "Error finding record",
            datails: error.message
        });
    }

});

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
})


module.exports = router;