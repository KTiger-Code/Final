const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all students
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET student by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST create new student
router.post('/', async (req, res) => {
  try {
    const { fullname, email, major } = req.body;

    // Validation
    if (!fullname || !email || !major) {
      return res.status(400).json({
        success: false,
        error: 'Please provide fullname, email, and major'
      });
    }

    const { data, error } = await supabase
      .from('students')
      .insert([{ fullname, email, major }])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, major } = req.body;

    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (major) updateData.major = major;

    const { data, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET student's enrolled courses
router.get('/:id/courses', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (
          id,
          name,
          description,
          credit
        )
      `)
      .eq('student_id', id);

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
