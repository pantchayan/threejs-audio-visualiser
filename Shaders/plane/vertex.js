const vertex = /* glsl */ `
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
void main()
{
    
    vec4 modelPosition = modelMatrix * vec4(position, 0.5);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}`;
export default vertex;
