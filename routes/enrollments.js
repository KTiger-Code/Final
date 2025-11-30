const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all enrollments
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        students (
          id,
          fullname,
          email,
          major
        ),
        courses (
          id,
          name,
          description,
          credit
        )
      `)
      .order('enrollment_date', { ascending: false });

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

// GET enrollment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        students (
          id,
          fullname,
          email,
          major
        ),
        courses (
          id,
          name,
          description,
          credit
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found'
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

// POST create new enrollment (student enrolls in a course)
router.post('/', async (req, res) => {
  try {
    const { student_id, course_id } = req.body;

    // Validation
    if (!student_id || !course_id) {
      return res.status(400).json({
        success: false,
        error: 'Please provide student_id and course_id'
      });
    }

    // Check if student exists
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('id', student_id)
      .single();

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Check if course exists
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('id', course_id)
      .single();

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', student_id)
      .eq('course_id', course_id)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Student is already enrolled in this course'
      });
    }

    // Create enrollment
    const { data, error } = await supabase
      .from('enrollments')
      .insert([{ student_id, course_id }])
      .select(`
        *,
        students (
          id,
          fullname,
          email,
          major
        ),
        courses (
          id,
          name,
          description,
          credit
        )
      `);

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE enrollment (unenroll student from course)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      message: 'Enrollment deleted successfully',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
