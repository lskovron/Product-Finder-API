<section id='api'>
	<div class='container-fluid'>
		<div class='row flex'>
			<div class='col-sm-8' style="position:relative;">
				<div id="map"></div>
				<div class='loading-overlay'></div>
				<div id="invalidZip">
					<h3></h3>
					<span class='kill'>x</span>
				</div>
			</div>
			<div class='col-sm-4'>
				<div class='results-wrap'>
					<form id="where-to-buy-form">
						<label class='hidden' for="zip">Enter Zip Code</label>
						<input type="text" name="zip" class="pcl-zip" placeholder="Zip Code" id="zip">
						<label class='hidden' for="radius">Enter Search Radius</label>
						<select name="radius" class="pcl-radius" id="radius">
						  <option value="1" selected>Distance</option>
						  <option value="1">1 mile</option>
						  <option value="5">5 miles</option>
						  <option value="10">10 miles</option>
						  <option value="15">15 miles</option>
						  <option value="25">25 miles</option>
						</select>
					</form>
					<div class='text-center btn-wrap'><a class='small-button' id="subbutton">Submit</a></div>
					<div class='results'>
						
						<div class='text-center res-nav'>
							<div class="dir-left" style="display:none;"><</div>
							<h3 class='res-header'></h3>
							<div class="dir-right" style="display:none;">></div>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</section>

<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri(); ?>/api.js"></script>
<script type='text/javascript' src='https://maps.googleapis.com/maps/api/js?key=******google_maps_api_kep********&callback=initMap&language=en&ver=4.5.15'></script>
