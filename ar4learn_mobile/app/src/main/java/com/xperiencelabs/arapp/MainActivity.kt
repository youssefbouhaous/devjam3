package com.xperiencelabs.arapp

import android.media.MediaPlayer
import android.os.Bundle
import android.view.GestureDetector
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.ScaleGestureDetector
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.SeekBar
import android.widget.Spinner
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.ui.test.isEnabled
import androidx.core.view.isGone
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.ar.core.Config
import io.github.sceneview.ar.ArSceneView
import io.github.sceneview.ar.node.ArModelNode
import io.github.sceneview.ar.node.PlacementMode
import io.github.sceneview.math.Position
import io.github.sceneview.math.Rotation
import io.github.sceneview.node.VideoNode

class MainActivity : AppCompatActivity() {

    private lateinit var sceneView: ArSceneView
    private lateinit var placeButton: ExtendedFloatingActionButton
    private lateinit var classroomMenuButton: FloatingActionButton
    private lateinit var modelNode: ArModelNode
    private lateinit var mediaPlayer: MediaPlayer
    private lateinit var modelSpinner: Spinner
    private lateinit var scaleSeekBar: SeekBar
    private lateinit var rotateSeekBar: SeekBar
    private lateinit var moveSeekBar: SeekBar
    private lateinit var classroomNameText: TextView
    private lateinit var participantsCountText: TextView

    private lateinit var scaleGestureDetector: ScaleGestureDetector
    private lateinit var gestureDetector: GestureDetector

    private val classroomName = "Anatomy 101"
    private val participants = arrayOf("Teacher (You)", "John", "Emma", "Michael", "Sophia")
    private val modelList = listOf("a.glb", "b.glb", "c.glb", "d.glb", "sofa.glb", "chair.glb", "plane.glb")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        sceneView = findViewById<ArSceneView>(R.id.sceneView).apply {
            lightEstimationMode = Config.LightEstimationMode.DISABLED
        }

        mediaPlayer = MediaPlayer.create(this, R.raw.ad)

        setupUI()
        setupModelControls()
        initGestureDetectors()

        modelNode = ArModelNode(sceneView.engine, PlacementMode.INSTANT)
        loadModel(modelList[0])
        sceneView.addChild(modelNode)

        sceneView.setOnTouchListener { _: View, event: MotionEvent ->
            scaleGestureDetector.onTouchEvent(event)
            gestureDetector.onTouchEvent(event)
            true
        }
    }

    private fun setupUI() {
        placeButton = findViewById(R.id.place)
        placeButton.setOnClickListener { placeModel() }

        classroomNameText = findViewById(R.id.classroom_name)
        classroomNameText.text = classroomName

        participantsCountText = findViewById(R.id.participants_count)
        participantsCountText.text = "${participants.size} participants"

        classroomMenuButton = findViewById(R.id.classroom_menu_button)
        classroomMenuButton.setOnClickListener { showClassroomMenu() }

        modelSpinner = findViewById(R.id.modelSpinner)
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, modelList)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        modelSpinner.adapter = adapter

        modelSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                val selectedModel = modelList[position]
                loadModel(selectedModel)
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }
    }

    private fun setupModelControls() {
        scaleSeekBar = findViewById(R.id.scaleSeekBar)
        rotateSeekBar = findViewById(R.id.rotateSeekBar)
        moveSeekBar = findViewById(R.id.moveSeekBar)

        scaleSeekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                val scale = progress / 100f
                modelNode.scale = Position(scale, scale, scale)
            }
            override fun onStartTrackingTouch(seekBar: SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: SeekBar?) {}
        })

        rotateSeekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                val rotation = Rotation(0f, progress.toFloat(), 0f)
                modelNode.rotation = rotation
            }
            override fun onStartTrackingTouch(seekBar: SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: SeekBar?) {}
        })

        moveSeekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                val move = progress / 100f
                modelNode.position = Position(modelNode.position.x, modelNode.position.y, move)
            }
            override fun onStartTrackingTouch(seekBar: SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: SeekBar?) {}
        })
    }

    private fun initGestureDetectors() {
        scaleGestureDetector = ScaleGestureDetector(this, object : ScaleGestureDetector.SimpleOnScaleGestureListener() {
            override fun onScale(detector: ScaleGestureDetector): Boolean {
                val scaleFactor = detector.scaleFactor
                val currentScale = modelNode.scale
                modelNode.scale = Position(
                    currentScale.x * scaleFactor,
                    currentScale.y * scaleFactor,
                    currentScale.z * scaleFactor
                )
                return true
            }
        })

        gestureDetector = GestureDetector(this, object : GestureDetector.SimpleOnGestureListener() {
            override fun onDoubleTap(e: MotionEvent): Boolean {
                modelNode.rotation = Rotation(0f, 0f, 0f)
                return true
            }

            override fun onLongPress(e: MotionEvent) {
                showModelOptionsDialog()
            }
        })
    }

    private fun loadModel(modelName: String) {
        sceneView.removeChild(modelNode)
        modelNode = ArModelNode(sceneView.engine, PlacementMode.INSTANT)
        modelNode.loadModelGlbAsync(
            glbFileLocation = "models/$modelName",
            scaleToUnits = 1f,
            centerOrigin = Position(x = -0.5f, y = 0f, z = 0f)
        ) { renderable ->
            sceneView.planeRenderer.isVisible = true
        }
        sceneView.addChild(modelNode)

        modelNode.onAnchorChanged = {
            placeButton.isGone = it != null
        }
    }

    private fun placeModel() {
        modelNode.anchor()
        sceneView.planeRenderer.isVisible = false
    }

    private fun showClassroomMenu() {
        val dialog = BottomSheetDialog(this)
        val view = layoutInflater.inflate(R.layout.classroom_menu, null)

        val participantsRecyclerView = view.findViewById<RecyclerView>(R.id.participants_recycler_view)
        participantsRecyclerView.layoutManager = LinearLayoutManager(this)
        participantsRecyclerView.adapter = ParticipantsAdapter(participants)

        val chatButton = view.findViewById<Button>(R.id.chat_button)
        chatButton.setOnClickListener {
            dialog.dismiss()
            showChatDialog()
        }

        val leaveButton = view.findViewById<Button>(R.id.leave_button)
        leaveButton.setOnClickListener {
            dialog.dismiss()
            showLeaveConfirmationDialog()
        }

        dialog.setContentView(view)
        dialog.show()
    }

    private fun showModelOptionsDialog() {
        val options = arrayOf("Add Annotation", "Show Details", "Hide Model", "Show Animation")

        AlertDialog.Builder(this)
            .setTitle("Model Options")
            .setItems(options) { dialog, which ->
                when (which) {
                    0 -> showAnnotationDialog()
                    1 -> showModelDetails()
                    2 -> toggleModelVisibility()
                    3 -> playModelAnimation()
                }
            }
            .show()
    }

    private fun showAnnotationDialog() {
        val dialogView = layoutInflater.inflate(R.layout.annotation_dialog, null)
        val annotationText = dialogView.findViewById<EditText>(R.id.annotation_text)

        AlertDialog.Builder(this)
            .setTitle("Add Annotation")
            .setView(dialogView)
            .setPositiveButton("Add") { dialog, _ ->
                val text = annotationText.text.toString()
                if (text.isNotEmpty()) {
                    addAnnotationToModel(text)
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun addAnnotationToModel(text: String) {
        // Implementation would add a text label to the model in 3D space
    }

    private fun showModelDetails() {
        val selectedModel = modelSpinner.selectedItem.toString()

        AlertDialog.Builder(this)
            .setTitle("Model Details")
            .setMessage("Model: $selectedModel\nPolygons: 24,568\nMaterials: 3\nTextures: 4")
            .setPositiveButton("OK", null)
            .show()
    }

    private fun toggleModelVisibility() {
        // Remove and re-add the model to the scene
        if (sceneView.children.contains(modelNode)) {
            sceneView.removeChild(modelNode)
        } else {
            sceneView.addChild(modelNode)
        }
    }

    private fun playModelAnimation() {
        // Implementation would play model animation if available
    }

    private fun showChatDialog() {
        val dialogView = layoutInflater.inflate(R.layout.chat_dialog, null)

        AlertDialog.Builder(this)
            .setTitle("Classroom Chat")
            .setView(dialogView)
            .setPositiveButton("Close", null)
            .show()
    }

    private fun showLeaveConfirmationDialog() {
        AlertDialog.Builder(this)
            .setTitle("Leave Classroom")
            .setMessage("Are you sure you want to leave the classroom?")
            .setPositiveButton("Yes") { _, _ -> finish() }
            .setNegativeButton("No", null)
            .show()
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::mediaPlayer.isInitialized) {
            mediaPlayer.release()
        }
        sceneView.destroy()
    }
}

class ParticipantsAdapter(private val participants: Array<String>) :
    RecyclerView.Adapter<ParticipantsAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val nameTextView: TextView = view.findViewById(R.id.participant_name)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.participant_item, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.nameTextView.text = participants[position]
    }

    override fun getItemCount() = participants.size
}